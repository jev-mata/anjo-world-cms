<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      background-color: #7C3AED; /* deep purple base */
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    /* Custom CSS for additional responsiveness */
    @media (max-width: 480px) {
      .responsive-container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
    
    /* Animation for the mascot */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .floating {
      animation: float 3s ease-in-out infinite;
    }
  </style>
</head>

<body class="flex items-center justify-center min-h-screen relative overflow-hidden w-full px-4">

  <!-- Background silhouette -->
  <div class="absolute inset-0 w-full h-full overflow-hidden">
    <img src="{{ asset('bg.png') }}"
         class="w-full h-full object-cover opacity-60"
         alt="Background graphics">
  </div>

  <!-- Main content wrapper -->
  <div class="flex flex-col items-center justify-center text-center z-20 responsive-container w-full max-w-md lg:max-w-lg xl:max-w-xl">

    <!-- Mascot with floating animation -->
    <div class="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
      <img src="{{ asset('anjo-mascott.png') }}"
           class="w-28 xs:w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 floating"
           alt="Mascot">
    </div>

    <!-- Error text -->
    <h1 class="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 md:mb-5 drop-shadow-lg">
      Error 404
    </h1>
    <p class="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-5 sm:mb-6 md:mb-7 lg:mb-8 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
      Oops! The page you are looking for cannot be found.
    </p>

    <!-- Button -->
    <a href="http://anjoworld.com"
       class="inline-block px-5 xs:px-6 sm:px-7 md:px-8 py-2 sm:py-3 md:py-4 bg-white text-purple-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105 active:scale-95 text-sm xs:text-base sm:text-lg">
      Go Back Home
    </a>
  </div>

</body>
</html>