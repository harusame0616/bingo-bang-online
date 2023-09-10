import { BingoCardGenerateUsecase } from "@/domains/BingoCard/usecases/BingoCardGenerate.usecase";
import {
  BINGO_CARD_MAX_COUNT,
  BingoGame,
  BingoGameStateEnum,
} from "@/domains/BingoGame/models/BingoGame";
import { BingoGameDrawLotteryNumberUsecase } from "@/domains/BingoGame/usecases/BingoGameDrawLotteryNumber.usecase";
import { BingoGameFindOneUsecase } from "@/domains/BingoGame/usecases/BingoGameFindOne.usecase";
import { BingoGameFindOneWithCardsQueryUsecase } from "@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase";
import { getRepository } from "@/lib/getRepository";
import { getQuery } from "@/lib/getQuery";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import LotteryRoulette from "./_components/LotteryRoulette";

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
  const bingoGameQueryUsecase = new BingoGameFindOneWithCardsQueryUsecase(
    getQuery("bingoGame")
  );
  const bingoGame = await bingoGameQueryUsecase.execute(bingoGameId);

  if (!bingoGame) {
    return notFound();
  }

  const canBingoCardGenerate = () => {
    return bingoGame.bingoCards.length === BINGO_CARD_MAX_COUNT;
  };

  return (
    <div>
      <h1>Bingo Game</h1>
      <div>{bingoGameId}</div>
      <div className="flex justify-center w-full">
        <LotteryRoulette number={bingoGame.lotteryNumbers.slice(-1)[0] ?? 0}>
          <form action={drawLotteryNumber}>
            <input
              type="text"
              name="bingoGameId"
              hidden
              defaultValue={bingoGameId}
            />
            <button disabled={bingoGame.state === BingoGameStateEnum.FINISHED}>
              ストップ
            </button>
          </form>
        </LotteryRoulette>
        <div></div>
      </div>

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
      {bingoGame.bingoCards.map((bingoCard) => (
        <div key={bingoCard.id}>{JSON.stringify(bingoCard)}</div>
      ))}
    </div>
  );
}
