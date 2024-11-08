import React, { useState } from "react";
import "./test.css";

const Letter: any = [
  { text: "A", idByImg: "A" },
  { text: "B", idByImg: "B" },
  { text: "C", idByImg: "C" },
  { text: "D", idByImg: "D" },
  { text: "E", idByImg: "E" },
  { text: "F", idByImg: "F" },
  { text: "G", idByImg: "G" },
  { text: "H", idByImg: "H" },
];
const imagesRender: any = [
  {
    src: "https://i.pinimg.com/736x/6e/35/7b/6e357bed11b2e2a3862137674ecd5531.jpg",
    id: "A",
  },
  {
    src: "https://i.pinimg.com/564x/5d/13/49/5d1349b79f49d4461fd256d7072d0130.jpg",
    id: "B",
  },
  {
    src: "https://i.pinimg.com/736x/a5/fd/af/a5fdaf57be37f01147b3bd7a318828b4.jpg",
    id: "C",
  },
  {
    src: "https://i.pinimg.com/736x/2a/49/fe/2a49fe5bb3892e622df678ec4141e5a6.jpg",
    id: "D",
  },
  {
    src: "https://i.pinimg.com/736x/c0/29/ff/c029ff6eef9c8bff8a3d0a27f008bd14.jpg",
    id: "E",
  },
  {
    src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhW1jHHkhEAkP6c1bNNWzdpKf4ZPdZ5yXD46qXEFW6nDATp88qmYG2U2iDK4KkymnzxRtqWK8-GWaAt05BsxjMrp5yR5JwRXHdLCfm8xOzTog6PRz0RdEQ6WqM4alQZqXy7Qnj5pYJtbV0/s1600/27175316247_1b70df7f4c_k.jpg",
    id: "F",
  },
  {
    src: "https://i.pinimg.com/564x/56/c1/3d/56c13d61eb73d60d21cbb90784fdf9e7.jpg",
    id: "G",
  },
  {
    src: "https://i.pinimg.com/736x/0a/0a/35/0a0a35bcc0f5f44ebb6ac76dc426a4f1.jpg",
    id: "H",
  },
];
const randomizeArrayWithMatch = <T,>(arr1: T[], arr2: T[]) => {
  const shuffled1 = [...arr1].sort(() => 0.5 - Math.random()).slice(0, 3);
  const matchedItem: any =
    shuffled1[Math.floor(Math.random() * shuffled1.length)];
  const shuffled2 = [
    matchedItem
      ? arr2.find((el: any) => el.id === matchedItem.idByImg)
      : arr2[0],
    ...arr2
      .filter((el: any) => el.id !== matchedItem?.idByImg)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2),
  ];

  return {
    letters: shuffled1,
    images: shuffled2,
  };
};

const Test = () => {
  const [data, setData] = useState(randomizeArrayWithMatch(Letter, imagesRender));
  const [isInteractionAllowed, setIsInteractionAllowed] = useState(true);

  const handleDrop = (e: React.DragEvent, idByImg: string) => {
    if (!isInteractionAllowed) return;

    const droppedId = e.dataTransfer.getData("text/plain");
    const droppedElement = document.getElementById(droppedId);
    const targetElement = document.getElementById(`letter-${idByImg}`);

    if (droppedId === idByImg) {
      droppedElement?.classList.add("hidden");
      targetElement?.classList.add("animate-scale", "text-green-500");
      setIsInteractionAllowed(false);
    } else {
      droppedElement?.classList.remove("animate-shake");
      targetElement?.classList.remove("animate-shake");
      
      setTimeout(() => {
        droppedElement?.classList.add("animate-shake");
        targetElement?.classList.add("animate-shake");
      }, 0);
    }
  };

  const handleShuffle = () => {
    data.letters.forEach((el: any) => {
      const element = document.getElementById(`letter-${el.idByImg}`);
      element?.classList.remove("animate-scale", "text-green-500", "animate-shake");
    });
    data.images.forEach((el: any) => {
      const element = document.getElementById(el.id);
      element?.classList.remove("hidden", "animate-shake");
    });

    setData(randomizeArrayWithMatch(Letter, imagesRender));
    setIsInteractionAllowed(true);
  };
  return (
    <div className="flex flex-col items-center h-screen py-10">
      <div className="flex gap-4 mb-4">
        {data.images.map((el: any) => (
          <div
            key={el.id}
            id={el.id}
            className="w-40 h-44 rounded-md shadow-md relative cursor-pointer border border-transparent"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", el.id)}
          >
            <img src={el.src} className="w-full h-full object-cover" alt="" />
            <span className="absolute top-[-8px] left-[-8px] p-1 bg-white rounded-md shadow-md">{el.id}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mb-4">
        {data.letters.map((el: any) => (
          <div
            key={el.idByImg}
            id={`letter-${el.idByImg}`}
            className="w-40 h-44 flex items-center justify-center text-[120px] font-bold rounded-md shadow-md bg-white"
            onDrop={(e) => handleDrop(e, el.idByImg)}
            onDragOver={(e) => e.preventDefault()}
          >
            {el.text}
          </div>
        ))}
      </div>
      <button onClick={handleShuffle} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Tiếp tục
      </button>
    </div>
  );

};

export default Test;
