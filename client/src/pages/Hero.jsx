import TypingBox from "../components/TypingBox";
// Fixed casing if your file matches the previous step

function Hero() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start bg-white px-4 py-4 select-none">
      {/* Container to handle layout balance */}
      <div className="w-full flex justify-center items-start mt-4">
        <TypingBox />
      </div>
    </div>
  );
}

export default Hero;
