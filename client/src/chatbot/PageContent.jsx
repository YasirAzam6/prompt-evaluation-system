// const PageContent = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
//       <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-center">
//         Welcome to the AI Assistant
//       </h1>
//       <p className="mt-3 text-lg max-w-md text-center text-white/90">
//         I'm here to help you with your queries. Click the chat icon at the bottom right to begin!
//       </p>
//     </div>
//   );
// };

// export default PageContent;

const PageContent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6 text-white">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 drop-shadow-lg">
          Lucidya AI Assistant
        </h1>
        <p className="mt-4 text-lg text-gray-300 leading-relaxed">
          I’m here to assist you with anything you need.  
          Click on the chat icon at the bottom right to start a conversation.
        </p>
      </div>
    </div>
  );
};

export default PageContent;
