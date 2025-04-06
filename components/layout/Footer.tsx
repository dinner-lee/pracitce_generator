export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} <a href = "https://manus.im/app">Manus AI</a> + <a href ="https://chat.openai.com/">chatGPT</a> + <a href = "https://dinnerlee.blogspot.com/">이정찬</a>.</p>
        </div>
      </div>
    </footer>
  );
}
