// import React from "react";
import Image1 from "../Images/Image1.png";
import Image2 from "../Images/Image2.png";
import Image3 from "../Images/Image3.png";
import Image4 from "../Images/Image4.png";

const teamMembers = [
  {
    name: "Chris Patt",
    role: "Administrative Staff",
    image: Image1,
  },
  {
    name: "Esther Howard",
    role: "Administrative Staff",
    image: Image2,
  },
  {
    name: "Darrell Steward",
    role: "Administrative Staff",
    image: Image3,
  },
  {
    name: "Robert Fox",
    role: "Administrative Staff",
    image: Image4,
  },
];

const Team = () => {
  return (
    <div className="py-10 bg-gray-50">
      {/* Centered Heading */}
      <div className="text-center mb-8">
        <h2 className="text-blue-600 font-semibold text-lg">OUR TEAMS</h2>
        <h1 className="text-3xl font-bold text-gray-800">Meet Our Agents</h1>
      </div>

      {/* Team Members Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-5 w-64 text-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4" // Adjusted image size
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {member.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{member.role}</p>
            <div className="flex justify-center gap-3">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
                title="Call"
              >
                📞
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
                title="Email"
              >
                ✉️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
