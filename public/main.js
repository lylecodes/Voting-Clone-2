const castVote = (id, votes) => {
  fetch("/photos", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
      votes: parseInt(votes) + 1,
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      localStorage.setItem("photo vote", "voted");
      window.location.reload(true);
    });
};

let hasVoted = localStorage.getItem("photo vote");
if (hasVoted) {
  const voteMsgs = document.querySelectorAll(".votes");
  voteMsgs.forEach((msg) => {
    msg.style.display = "block";
  });

  const btns = document.querySelectorAll(".btn");
  btns.forEach((btn) => {
    btn.style.display = "none";
  });
}
