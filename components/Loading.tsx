
const Loading = () => {
    return (
        <div className='h-screen w-screen flex justify-center items-center gap-8'>
            <span className='loader'></span>
            <span className="font-medium text-muted-foreground text-2xl">Loading...</span>
        </div>
    );
};

export default Loading;
