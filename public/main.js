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
      window.location.reload(true);
    });
};

let hasVoted = localStorage.getItem("voted");
if (!hasVoted) {
  const btns = document.querySelectorAll(".btn");
  btns.forEach((btn) => {
    btn.disabled = true;
    const totalVotes = getTotalVotes();
    btn.innerHTML = `Votes`;
  });
}
