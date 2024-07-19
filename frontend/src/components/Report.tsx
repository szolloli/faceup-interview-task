function Report({ content }: { content: string }) {
  return (
    <div className="flex flex-row border-2 rounded-md p-4 min-w-[200px] justify-between bg-card  truncate">
      <p>{content}</p>
    </div>
  );
}

export default Report;
