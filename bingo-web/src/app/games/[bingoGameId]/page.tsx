type Props = {
  params: {
    bingoGameId: string;
  };
};

export default async function GameNewPage({ params: { bingoGameId } }: Props) {
  return <div>{bingoGameId} </div>;
}
