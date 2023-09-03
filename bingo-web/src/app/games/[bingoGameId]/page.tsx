import { BingoGameStateEnum } from "@/domains/BingoGame/models/BingoGame";
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

export default async function GameNewPage({ params: { bingoGameId } }: Props) {
  const bingoGameFindOneUsecase = new BingoGameFindOneUsecase(
    getRepository("bingoGame")
  );
  const bingoGame = await bingoGameFindOneUsecase.execute(bingoGameId);

  if (!bingoGame) {
    return notFound();
  }

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
    </div>
  );
}
