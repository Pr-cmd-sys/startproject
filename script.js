function playCompleteSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return; // old browser fallback

    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.value = 0.001; // start very low to avoid click
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.linearRampToValueAtTime(0.15, now + 0.01);

    // melody: C5, E5, G5, short arpeggio
    const notes = [523.25, 659.25, 783.99, 659.25];
    const dur = 0.12; // seconds per note
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(gain);

      const start = now + i * dur;
      const stop = start + dur * 0.9;
      o.start(start);
      o.stop(stop);
    });

    gain.gain.linearRampToValueAtTime(0.0001, now + notes.length * dur + 0.05);

    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, (notes.length * dur + 0.2) * 1000);

  } catch (err) {
    console.warn('Audio playback failed:', err);
  }
}

// Elements
const taskInput = document.getElementById("taskinput");
const addBtn = document.getElementById("addbtn");
const taskList = document.getElementById("tasklist");

// Add task
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  // Create list item
  const li = document.createElement("li");

  // Task text
  const span = document.createElement("span");
  span.textContent = taskText;

  // Mark complete on click
  span.addEventListener("click", () => {
    span.classList.toggle("completed");
    if (span.classList.contains("completed")) {
      playCompleteSound(); // Play melody when completed
    }
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  // Clear input
  taskInput.value = "";
});
