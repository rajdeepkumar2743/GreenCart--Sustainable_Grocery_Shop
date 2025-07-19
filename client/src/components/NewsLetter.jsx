const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 mt-24 pb-16 px-4 relative z-10 bg-gradient-to-br from-white via-primary/5 to-white rounded-xl shadow-md overflow-hidden animate-fade-in">

            {/* Decorative Gradient Blur Circle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse"></div>

            <h1 className="md:text-4xl text-2xl font-extrabold text-gray-800 tracking-tight font-display animate-fade-in-up">
                Never Miss a Deal!
            </h1>
            <p className="md:text-lg text-sm text-gray-500 max-w-xl font-light animate-fade-in-up delay-100">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts.
            </p>

            <form className="flex items-center justify-center max-w-2xl w-full mt-4 animate-fade-in-up delay-200">
                <input
                    className="flex-grow h-12 md:h-14 px-4 md:px-6 text-sm md:text-base border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none rounded-l-lg text-gray-600 placeholder-gray-400 transition-all duration-200 shadow-sm focus:shadow-lg"
                    type="email"
                    placeholder="Enter your email address"
                    required
                />
                <button
                    type="submit"
                    className="h-12 md:h-14 px-6 md:px-10 bg-primary text-white font-semibold rounded-r-lg hover:bg-primary-dull transition-all duration-300 shadow-md hover:shadow-xl active:scale-95"
                >
                    Subscribe
                </button>
            </form>

            <p className="text-xs text-gray-400 mt-2 italic animate-fade-in-up delay-300">
                We’ll never spam you. Unsubscribe anytime.
            </p>
        </div>
    );
};

export default NewsLetter;
