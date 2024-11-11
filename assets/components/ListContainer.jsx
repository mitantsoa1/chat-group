import React from "react";
import List from "./List";

const ListContainer = ({ members, BASE_URL }) => {
  return (
    <div className="w-full max-w-2xl mx-auto shadow-lg bg-base-100 rounded-xl">
      <div className="p-4 border-b border-base-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Members</h2>
          <div className="flex items-center gap-2">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search members..."
                className="w-full max-w-xs input input-bordered input-sm"
              />
            </div>
            <button className="btn btn-primary btn-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Member
            </button>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-base-200">
        {members.map((member) => (
          <List key={member.id} member={member} BASE_URL={BASE_URL} />
        ))}
      </ul>

      {members.length === 0 && (
        <div className="p-8 text-center text-base-content/70">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-base-content/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-lg font-medium">No members found</p>
          <p className="mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ListContainer;
