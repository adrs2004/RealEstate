import React from "react";
import image1 from "../Images/HouseImage.png";

const HomeLengo = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 h-screen">
      <div className="w-full md:w-1/2 h-full">
        <div className="h-full flex items-center justify-center bg-neutral-200">
          <img
            src={image1}
            alt="Modern Interior"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 h-full p-8 flex flex-col justify-center bg-gray-100">
        <h2 className="text-blue-600 font-semibold text-lg">OUR BENEFIT</h2>
        <h1 className="text-3xl font-bold text-gray-800 my-4">
          Why Choose HomeLengo
        </h1>
        <p className="text-gray-600">
          Our seasoned team excels in real estate with years of successful
          market navigation, offering informed decisions and optimal results.
        </p>

        <div className="mt-8 space-y-6">
          <div className="bg-white shadow-md p-6 rounded-lg flex items-start">
            <div className="text-blue-600 mr-4">
              <i className="fas fa-clipboard-list text-3xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Proven Expertise
              </h3>
              <p className="text-gray-600">
                Our seasoned team excels in real estate with years of successful
                market navigation, offering informed decisions and optimal
                results.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg flex items-start">
            <div className="text-blue-600 mr-4">
              <i className="fas fa-clock text-3xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Customized Solutions
              </h3>
              <p className="text-gray-600">
                We pride ourselves on crafting personalized strategies to match
                your unique goals, ensuring a seamless real estate journey.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg flex items-start">
            <div className="text-blue-600 mr-4">
              <i className="fas fa-clipboard-list text-3xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Transparent Partnerships
              </h3>
              <p className="text-gray-600">
                Transparency is key in our client relationships. We prioritize
                clear communication and ethical practices, fostering trust and
                reliability throughout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLengo;
