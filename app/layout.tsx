"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactDOM from "react-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { mockText, mockText2 } from "./text";

interface IGlobalContext {
  add(key: string): void;
  remove(key: string): void;
  hideContent: boolean;
}
const GlobalContext = createContext({} as IGlobalContext);

const GlobalContextProvider = ({ children }: any) => {
  const [modalStates, setModalStates] = useState<Map<string, boolean>>(
    new Map()
  );

  const modalsStatesList = Array.from(modalStates.values());
  const hideContent = modalsStatesList.some((value) => value === true);

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (hideContent) {
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "auto";
    }
  }, [hideContent]);

  function add(key: string) {
    setModalStates((prev) => new Map(prev).set(key, true));
  }
  function remove(key: string) {
    setModalStates((prev) => new Map(prev).set(key, false));
  }

  console.log({ modalStates });

  return (
    <GlobalContext.Provider
      value={{
        add,
        remove,
        hideContent,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider>
          <div className=" flex flex-col min-h-screen p-3 relative">
            <NavAndHeader />
            <div className="flex-1 modal-container  flex flex-col relative">
              <MyApp />
            </div>
          </div>
        </GlobalContextProvider>
      </body>
    </html>
  );
}

const Modal = ({ id, isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  const { add, remove } = useContext(GlobalContext);

  function onCloseCallback() {
    remove(id);
    onClose();
  }
  function onOpenCallback() {
    add(id);
  }

  useEffect(() => {
    if (isOpen === true) {
      onOpenCallback();
    }
  }, [isOpen]);

  return ReactDOM.createPortal(
    <div className="absolute overflow-y-auto    h-full inset-0 z-10 flex flex-col lg:left-1/4 lg:w-1/2 lg:h-[500px] ">
      <div className="flex-1 bg-gray-400 overflow-y-auto z-20 text-black border-4 border-red-500">
        <button className="p-2" onClick={onCloseCallback}>
          Close Modal
        </button>
        <div className="p-4">
          <h1 className="text-green-500 text-2xl">{title}</h1>
          <p>{content}</p>
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
};

const NavAndHeader = () => {
  const { hideContent } = useContext(GlobalContext);

  const className = !hideContent ? "sticky top-0 z-10" : "";
  return (
    <div className={className}>
      <Header
        modalId="modal-2"
        className="bg-orange-200 text-black"
        title="Header nav"
        content={mockText}
      />
      <Header
        modalId="modal-1"
        className="bg-pink-200 text-black"
        title="Navbar nav"
        content={mockText2}
      />
    </div>
  );
};

const Header = ({
  title,
  className,
  content,
  modalId,
}: {
  title: string;
  className: string;
  content: string;
  modalId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <header className={className}>
        <h1 className="text-2xl text-black">Header</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Toggle header nav
        </button>
      </header>

      <Modal
        id={modalId}
        content={content}
        title={title}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

const MyApp = () => {
  const { hideContent } = useContext(GlobalContext);

  console.log({ hideContent });
  const className =
    "flex flex-col h-screen " + (hideContent ? "hidden lg:block" : "");
  return (
    <div className={className}>
      <div className="flex-1 p-4 relative">
        <div className="mt-20">{mockText}</div>
      </div>
    </div>
  );
};
