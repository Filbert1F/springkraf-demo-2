export default function ErrorPage({ message }: { message: Error }) {
  return (
    <>
      <p className="text-4xl">
        {message.message}
      </p>
    </>
  );
}
