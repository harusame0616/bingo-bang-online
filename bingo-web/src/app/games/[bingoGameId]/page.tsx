import { BingoGameDrawLotteryNumberUsecase } from "@/domains/BingoGame/usecases/BingoGameDrawLotteryNumber.usecase";
import { getRepository } from "@/lib/getRepository";

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
}

export default async function GameNewPage({ params: { bingoGameId } }: Props) {
  return (
    <div>
      <h1>Bingo Game</h1>
      <div>{bingoGameId}</div>
      <form action={drawLotteryNumber}>
        <input type="text" name="bingoGameId" hidden value={bingoGameId} />
        <button>番号を抽選する</button>
      </form>
    </div>
  );
}
