import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [idade, setIdade] = useState("");
  const [resultado, setResultado] = useState("");
  const [visivel, setVisivel] = useState(false);
  const canvasRef = useRef(null);

  // Verificar idade
  function verifyAge() {
    setVisivel(false);
    const idadeNum = parseInt(idade);

    let msg = "";
    if (isNaN(idadeNum) || idadeNum < 0) {
      msg = "Por favor, insira uma idade válida";
    } else if (idadeNum < 18) {
      msg = "Você é menor de idade";
    } else if (idadeNum < 60) {
      msg = "Você é adulto";
    } else {
      msg = "Você é idoso";
    }

    setTimeout(() => {
      setResultado(msg);
      setVisivel(true);
    }, 100);
  }

  // === Partículas no background ===

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ajusta o tamanho do canvas para preencher a janela
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();

    // Mouse tracking
    let mouse = {
      x: null,
      y: null,
      radius: 150,
    };

    function onMouseMove(event) {
      mouse.x = event.x;
      mouse.y = event.y;
    }

    function onMouseOut() {
      mouse.x = undefined;
      mouse.y = undefined;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("resize", resizeCanvas);

    // Partículas
    let particlesArray = [];
    const np = 200;

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Inverter direção nas bordas
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.directionX = -this.directionX;
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < np; i++) {
        let psize = Math.random() * 2 + 1;
        let px = Math.random() * (window.innerWidth - psize * 2) + psize;
        let py = Math.random() * (window.innerHeight - psize * 2) + psize;
        let pDirectionX = Math.random() * 0.4 - 0.2;
        let pDirectionY = Math.random() * 0.4 - 0.2;
        let color = "#a32742";

        particlesArray.push(new Particle(px, py, pDirectionX, pDirectionY, psize, color));
      }
    }

    function connect() {
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          let dx = particlesArray[i].x - particlesArray[j].x;
          let dy = particlesArray[i].y - particlesArray[j].y;
          let distance = dx * dx + dy * dy;

          const maxDistance = (canvas.width / 7) * (canvas.height / 7);

          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(163, 39, 66, ${1 - distance / 20000})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }

      connect();
      requestAnimationFrame(animate);
    }

    init();
    animate();

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas id="background-canvas" ref={canvasRef}></canvas>

      <div className="container">
        <h1>Verificador de Idade</h1>
        <p className="subtitulo">Digite sua idade para continuar.</p>
        <input
          type="number"
          id="idade"
          placeholder="Sua idade aqui..."
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && verifyAge()}
        />
        <button id="verifyButton" onClick={verifyAge}>
          Verificar
        </button>
        <p id="resultado" className={visivel ? "visível" : ""}>
          {resultado}
        </p>
      </div>
    </>
  );
}

export default App;
