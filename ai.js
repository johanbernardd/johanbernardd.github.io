let modelUSE = {};
let input;
let answerDiv;

// Calculate the dot product of two vector arrays.
const dotProduct = (xs, ys) => {
  const sum = (xs) => (xs ? xs.reduce((a, b) => a + b, 0) : undefined);
  const zipWith = (f, xs, ys) => {
    const ny = ys.length;
    return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
  };
  return xs.length === ys.length
    ? sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
};

// Individual response constants from lines 23-35
const responseSkill =
  "He's not just about skill, but he brings clarity, creativity, and heart into every project. Whether it's building systems or solving data problems, he shows up with intention.";
const responseTechInterest =
  "He enjoys analyzing how everyday tech can solve real-world problems. When not coding or writing, you'll probably find him enjoying a good movie or rethinking user experiences.";
const responseStrategist =
  "He's an aspiring tech strategist with strong roots in data analytics, enterprise systems, and digital transformation. He's currently exploring NLP, the future of finance, and tech.";
const responseTeamwork =
  "You'll notice right away that he listens first, acts with purpose, and genuinely cares about results and people. His teammates often say he makes complex work feel simple and manageable.";
const responseReliability =
  "Definitely. From academic mentors to project teammates, many have praised his reliability, adaptability, and ability to make data 'speak.'";
const responseWebsite =
  "You're currently on Johanes personal website! Feel free to look around and explore what he's been building, studying, and sharing lately";
const responseFullName =
  "His full name is Johanes Paulus Bernard Purek, but feel free to call him Johanes, or just say hi to his AI twin here";
const responseAIAssistant =
  "Sort of! This AI assistant is trained on everything about him—projects, skills, and goals—so go ahead and ask anything. He'd love that.";
const responseJourney =
  "This space is here to share Johanes journey from tech explorations to AI experiments in a fun, conversational way. Type in your questions and enjoy the ride.";
const responseSmile =
  "You'd probably get a big smile and a “Thanks a lot, hope your day is amazing too!”";
const responseEducation =
  "He is currently studying Information Systems at Universitas Brawijaya with a focus on data science, AI, and digital transformation.";
const responseTeaching =
  "Yes! He was a Teaching Assistant in programming and database courses, helping students achieve high scores and understand complex topics more easily.";
const responseProjects =
  "He's worked on various data-driven projects, including credit risk modeling, customer segmentation, and a personalized nutrition tracking app using AI.";

// General QnA for Johanes
const process_general = async () => {
  const model = await modelUSE;
  const input = {
    queries: [query.value.toLowerCase()],
    responses: [
      responseSkill,
      responseTechInterest,
      responseStrategist,
      responseTeamwork,
      responseReliability,
      responseWebsite,
      responseFullName,
      responseAIAssistant,
      responseJourney,
      responseSmile,
      responseEducation,
      responseTeaching,
      responseProjects,
    ],
  };

  const embeddings = await model.embed(input);
  const embed_query = embeddings["queryEmbedding"].arraySync()[0];
  const embed_responses = embeddings["responseEmbedding"].arraySync();

  let scores = [];
  for (let i = 0; i < embed_responses.length; i++) {
    scores.push(dotProduct(embed_query, embed_responses[i]));
    if (i === embed_responses.length - 1) {
      document.getElementById("loading_dots").style.display = "none";
    }
  }

  const max_idx = scores.reduce(
    (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
    0
  );

  const chosen_response =
    scores[max_idx] < 10.5
      ? "Sorry, I can't respond to that for now. Please do reach Johanes directly through LinkedIn to discuss it with him"
      : input.responses[max_idx];

  answerDiv.style.display = "inline-block";
  answerDiv.innerHTML = chosen_response;
  output_timeout = setTimeout(() => {
    answerDiv.innerHTML = "";
  }, chosen_response.length * 55);
};

// Function to return a specific response by index, similar to process_general
const process_specific = async (responseIdx) => {
  const model = await modelUSE;
  const input = {
    queries: [query.value.toLowerCase()],
    responses: [
      responseSkill,
      responseTechInterest,
      responseStrategist,
      responseTeamwork,
      responseReliability,
      responseWebsite,
      responseFullName,
      responseAIAssistant,
      responseJourney,
      responseSmile,
      responseEducation,
      responseTeaching,
      responseProjects,
    ],
  };
  // Only use the selected response
  const chosen_response = input.responses[responseIdx];
  document.getElementById("loading_dots").style.display = "none";
  answerDiv.style.display = "inline-block";
  answerDiv.innerHTML = chosen_response;
  output_timeout = setTimeout(() => {
    answerDiv.innerHTML = "";
  }, chosen_response.length * 55);
};

// Reserved topic-specific models (you can expand later)
// const process_trave = () => {};
// const process_tokped = () => {};
// const process_doit = () => {};
// const process_qlue = () => {};
// const process_wb = () => {};

// First-time flag
i_model = 0;

window.onload = () => {
  query = document.getElementById("myInput");
  answerDiv = document.getElementById("output");

  query.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
      if (i_model === 0) {
        answerDiv.style.display = "none";
        document.getElementById("first_assistant_desc").style.display = "none";
        document.getElementById("loading_dots").style.display = "inline-block";
        modelUSE = use.loadQnA(); // important!
      } else {
        answerDiv.style.display = "none";
        clearTimeout(output_timeout);
      }

      i_model++;

      tf.setBackend("webgl");

      const q = query.value.toLowerCase();
      // Keyword-based index mapping for specific responses
      if (
        q.includes("skill") ||
        q.includes("clarity") ||
        q.includes("creativity")
      ) {
        process_specific(0);
      } else if (
        q.includes("tech") ||
        q.includes("movie") ||
        q.includes("user experience")
      ) {
        process_specific(1);
      } else if (
        q.includes("strategist") ||
        q.includes("analytics") ||
        q.includes("nlp") ||
        q.includes("finance")
      ) {
        process_specific(2);
      } else if (
        q.includes("team") ||
        q.includes("teammate") ||
        q.includes("work simple")
      ) {
        process_specific(3);
      } else if (
        q.includes("reliable") ||
        q.includes("adaptable") ||
        q.includes("data speak")
      ) {
        process_specific(4);
      } else if (q.includes("website") || q.includes("personal website")) {
        process_specific(5);
      } else if (q.includes("full name") || q.includes("name")) {
        process_specific(6);
      } else if (q.includes("ai assistant") || q.includes("ai twin")) {
        process_specific(7);
      } else if (
        q.includes("journey") ||
        q.includes("exploration") ||
        q.includes("experiment")
      ) {
        process_specific(8);
      } else if (q.includes("smile") || q.includes("thanks")) {
        process_specific(9);
      } else if (
        q.includes("study") ||
        q.includes("education") ||
        q.includes("brawijaya")
      ) {
        process_specific(10);
      } else if (
        q.includes("teaching") ||
        q.includes("assistant") ||
        q.includes("database")
      ) {
        process_specific(11);
      } else if (
        q.includes("project") ||
        q.includes("credit risk") ||
        q.includes("customer segmentation") ||
        q.includes("nutrition")
      ) {
        process_specific(12);
      } else {
        process_general();
      }
    }
  });
};
