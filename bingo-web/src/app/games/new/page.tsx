import { InMemoryGameRepository } from "@/domains/BingoGame/infrastructures/IMBingoGameRepository";
import { BingoGameCreateUsecase } from "@/domains/BingoGame/usecases/BingoGameCreate.usecase";
import { redirect } from "next/navigation";

export default async function GameNewPage() {
  const bingoGameCreateUsecase = new BingoGameCreateUsecase(
    new InMemoryGameRepository()
  );

  const bingoGame = await bingoGameCreateUsecase.execute();
  redirect(`/games/${bingoGame.id}`);
}
