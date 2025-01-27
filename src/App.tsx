import reactLogo from "./assets/react.svg";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold text-red-500 underline">
        Hello world!
      </h1>
      <div className="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 ...">
        <img className="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0" src={reactLogo} alt="" />
        <div className="space-y-2 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-lg font-semibold text-black">Erin Lindford</p>
            <p className="font-medium text-gray-500">Product Engineer</p>
          </div>
          <button className="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 ...">
            Message
          </button>
        </div>
      </div>
      <button className="bg-sky-500 hover:bg-sky-700 ...">Save changes</button>
    </>
  );
}

export default App;
