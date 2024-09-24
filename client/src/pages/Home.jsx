

function Home() {
  
  return (
    <div className=" flex flex-col md:flex-row items-center justify-center min-h-screen ">
      <img
        src="https://theaicuisine.com/wp-content/uploads/2023/06/A-photo-of-a-chef-and-an-AI-system-working-together-in-the-kitchen.webp"
        alt="Description" 
        className="w-[26.5rem] h-[29rem] rounded-lg md:mr-8 mb-4 md:mb-0"
      />
      <div className="text-center md:text-left p-4 md:w-1/2">
        <h1 className="text-5xl font-bold mb-4">Welcome to  <span>Flavor Nexus</span> </h1>
        <p className="mb-4 text-lg">

We’re excited you’re here! With Flavor Nexus, you can easily customize recipes based on your ingredients, choose your cuisine and meal type, and get personalized cooking tips. Save your favorite recipes, explore new flavor ideas, and enjoy cooking with our simple and fun app. Let’s get cooking!
        </p>
        {/* <div className="flex justify-center md:justify-start space-x-4">
          <a
            href="https://github.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="https://youtube.com/your-channel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="text-2xl" />
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
