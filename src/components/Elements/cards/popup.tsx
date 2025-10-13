export const Popup = ({ children, onClose,styleMod }: { children: React.ReactNode; onClose?: () => void,styleMod?:string }) => (
    <div
      className={`z-20 fixed top-0 left-0 right-0 w-full h-auto bg-gray-950 bg-opacity-80 flex justify-center items-center ${styleMod}`}
      onClick={onClose}
    >
      <div
        className={`rounded-lg md:w-1/2 h-screen overflow-y-auto cts-scrollbar ${styleMod}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );