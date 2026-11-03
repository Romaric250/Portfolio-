const Landing = () => {
  return (
    <div className="mt-20 px-6">

      <div className="flex flex-col lg:flex-row items-center bg-primary text-white p-6 lg:p-12 rounded-lg shadow-lg">
        <div className="bg-secondary-100 text-wrap p-6 lg:p-12 rounded-lg shadow-md lg:w-2/3">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">I&apos;m a Software Engineer</h1>
          <p className="text-lg lg:text-xl mb-4">
            Specialized in Backend Engineering with a deep passion for fetching data. With over 4 years of experience, I build scalable, fast, robust, and secured applications using the most up-to-date technologies available. My forte lies in Quality Assurance and Automation – ensuring that projects meet the highest QA standards while automating any repetitive tasks to streamline processes.
          </p>
          <p className="text-lg lg:text-xl mb-4">
            When it comes to Tutoring, I find joy in sharing my knowledge with students of all ages. Whether it&apos;s explaining complex concepts or simplifying technical jargon, I can easily adjust my teaching approach to suit different age groups.
          </p>
          <p className="text-lg lg:text-xl">
            I am dedicated to continuous learning to refine my skills and stay relevant to the evolving technological fields.
          </p>
        </div>

        <div
          className="flex shrink-0 items-center justify-center bg-secondary text-white w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] mt-6 lg:mt-0 lg:ml-12 rounded-full shadow-lg"
          aria-label="Romaric Lonfonyuy profile photo placeholder"
        >
          <span className="text-7xl font-bold lg:text-8xl">RL</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;