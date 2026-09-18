import React from 'react';

export const Loading: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  const content = (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};
