import { BingoCardGenerateUsecase } from "@/domains/BingoCard/usecases/BingoCardGenerate.usecase";
import {
  BINGO_CARD_MAX_COUNT,
  BingoGame,
  BingoGameStateEnum,
} from "@/domains/BingoGame/models/BingoGame";
import { BingoGameDrawLotteryNumberUsecase } from "@/domains/BingoGame/usecases/BingoGameDrawLotteryNumber.usecase";
import { BingoGameFindOneUsecase } from "@/domains/BingoGame/usecases/BingoGameFindOne.usecase";
import { getRepository } from "@/lib/getRepository";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

type Props = {
  params: {
    bingoGameId: string;
  };
};

async function drawLotteryNumber(formData: FormData) {
  "use server";

  const bingoGameId = formData.get("bingoGameId");

  if (!bingoGameId) {
    throw new Error("bingoGameId is required");
  }

  if (typeof bingoGameId !== "string") {
    throw new Error("bingoGameId is invalid type");
  }

  const drawLotteryNumberUsecase = new BingoGameDrawLotteryNumberUsecase(
    getRepository("bingoGame")
  );
  await drawLotteryNumberUsecase.execute(bingoGameId);
  revalidatePath("/game/[bingoGameId]");
}

async function generateDomainCard(formData: FormData) {
  "use server";

  const bingoGameId = formData.get("bingoGameId");

  if (!bingoGameId) {
    throw new Error("bingoGameId is required");
  }

  if (typeof bingoGameId !== "string") {
    throw new Error("bingoGameId is invalid type");
  }

  const bingoCardGenerateUsecase = new BingoCardGenerateUsecase({
    bingoCardRepository: getRepository("bingoCard"),
    bingoGameRepository: getRepository("bingoGame"),
  });

  await bingoCardGenerateUsecase.execute(bingoGameId);
  revalidatePath("/game/[bingoGameId]");
}

export default async function GameNewPage({ params: { bingoGameId } }: Props) {
  const bingoGameFindOneUsecase = new BingoGameFindOneUsecase(
    getRepository("bingoGame")
  );
  const bingoGame = await bingoGameFindOneUsecase.execute(bingoGameId);

  if (!bingoGame) {
    return notFound();
  }

  const canBingoCardGenerate = () => {
    return bingoGame.bingoCardIds.length === BINGO_CARD_MAX_COUNT;
  };

  return (
    <div>
      <h1>Bingo Game</h1>
      <div>{bingoGameId}</div>
      <form action={drawLotteryNumber}>
        <input
          type="text"
          name="bingoGameId"
          hidden
          defaultValue={bingoGameId}
        />
        <button disabled={bingoGame.state === BingoGameStateEnum.FINISHED}>
          番号を抽選する
        </button>
      </form>
      {bingoGame.state === BingoGameStateEnum.FINISHED ? (
        <div>抽選終了</div>
      ) : (
        <div>抽選中</div>
      )}
      <div className="flex flex-wrap gap-8">
        {bingoGame.lotteryNumbers.map((lotteryNumber) => (
          <div key={lotteryNumber}>{lotteryNumber}</div>
        ))}
      </div>
      <form action={generateDomainCard}>
        <input
          type="text"
          name="bingoGameId"
          hidden
          defaultValue={bingoGameId}
        />
        <button disabled={canBingoCardGenerate()}>BingoCard 生成</button>
      </form>

      <hr />
      {bingoGame.bingoCardIds.map((id) => (
        <div key={id}>{id}</div>
      ))}
    </div>
  );
}
