const NewsDetail = ({ params: { code } }: { params: { code: string } }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen text-white ">
      {code} News
    </div>
  );
};

export default NewsDetail;
