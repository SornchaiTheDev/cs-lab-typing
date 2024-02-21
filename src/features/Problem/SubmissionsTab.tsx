import Submission from "./Submission";

function SubmissionsTab() {
  return (
    <>
      <div className="flex flex-col">
        {new Array(4).fill(0).map((_, index) => (
          <Submission key={index} order={4 - index} active={index === 0} />
        ))}
      </div>
    </>
  );
}

export default SubmissionsTab;
