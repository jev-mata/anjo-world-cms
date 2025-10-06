import { useEffect } from "react"

import ShowQna from "./ShowQna";
export default function ShowTopics({ topic }) {
    useEffect(() => {
        console.log(topic)
    }, [topic])
    return (
        <div
            className={`${topic.parent_id != null ? " pl-6 pt-1 pb-1 pr-1 -mx-3 " : " px-4 "} py-2 text-left bg-white rounded-2xl m-2`} style={{
                backgroundColor: topic.parent_id != null ? topic.color != "#000000" ? topic.color : "" : "",
            }}
        >
            <div
                className={`${topic.parent_id != null ? "p-2" : ""} bg-white p-1 rounded-r-xl `}
            >
                <h3 className="font-[800] text-[#3A3A3A] mb-2 ">
                    {topic.title}
                </h3>
                <p className="whitespace-pre-line text-[#828282] font-[500] text-sm mb-4">
                    {topic.description}
                </p>

                {topic.video && (
                    <div className="mb-4">
                        {(() => {
                            let embedUrl = null;

                            try {
                                const url = new URL(topic.video);

                                if (url.searchParams.get("list")) {
                                    // 🎵 Playlist
                                    embedUrl = `https://www.youtube.com/embed/videoseries?list=${url.searchParams.get("list")}`;
                                } else if (url.searchParams.get("v")) {
                                    // 📹 Normal video
                                    embedUrl = `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
                                } else if (url.hostname.includes("youtu.be")) {
                                    // 📹 Short link
                                    embedUrl = `https://www.youtube.com/embed/${url.pathname.split("/").pop()}`;
                                }
                            } catch (e) {
                                console.warn("Invalid video URL:", topic.video);
                            }

                            return embedUrl ? (
                                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md shadow-md">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={embedUrl}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-sm">{topic.video}</p>
                            );
                        })()}
                    </div>
                )}

                {topic.image_path &&
                    <img className="rounded-lg" src={`/storage/${topic.image_path}`} style={{
                        width: '100%'
                    }}></img>}


                {Array.isArray(topic.questions) && topic.questions.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-bold mb-2 text-gray-700">Quiz</h4>
                        {topic.questions.map((q) => (
                            <ShowQna key={q.id} question={q} contentId={topic.id} />
                        ))}
                    </div>
                )}
                {Array.isArray(topic.topics) && topic.topics.map((sub,index) =>
                    <ShowTopics topic={sub} key={index}></ShowTopics>
                )}
            </div>
        </div>
    )
}