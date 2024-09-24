import { Redirect } from "./redirect";

export default function Page() {
  return (
    <div className="flex flex-col w-full max-w-screen-lg m-auto p-2">
      <div className="flex flex-col w-full h-full shadow rounded overflow-hidden">
        <Redirect />
      </div>
    </div>
  );
}
