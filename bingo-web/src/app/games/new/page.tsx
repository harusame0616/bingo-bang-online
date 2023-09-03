import { BingoGameCreateUsecase } from "@/domains/BingoGame/usecases/BingoGameCreate.usecase";
import { getRepository } from "@/lib/getRepository";
import { redirect } from "next/navigation";

export default async function GameNewPage() {
  const createUsecase = new BingoGameCreateUsecase(getRepository("bingoGame"));

  const bingoGame = await createUsecase.execute();
  redirect(`/games/${bingoGame.id}`);
}
