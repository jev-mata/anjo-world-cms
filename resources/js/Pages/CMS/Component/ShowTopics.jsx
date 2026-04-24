import { useMemo, useState } from "react"

import ShowQna from "./ShowQna";
export default function ShowTopics({ topic,isSubtopic}) {
    const [expandedItems, setExpandedItems] = useState([]);
    const topicColor = topic.color && topic.color !== "#000000" ? topic.color : "";
const learnMoreTriggerClass = "mx-0.5 inline-flex items-center gap-1 rounded-full border border-orange-300 bg-yellow-100 px-2 py-0.5 align-baseline font-extrabold text-[#7A3D00] shadow-[0_3px_0_#F6940D] transition hover:-translate-y-0.5 hover:bg-yellow-200 hover:shadow-[0_4px_0_#F6940D] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:translate-y-0 active:shadow-[0_1px_0_#F6940D]";

    const learnMoreItems = useMemo(() => {
        if (!Array.isArray(topic.learn_more_items)) {
            return [];
        }

        return topic.learn_more_items
            .map((item, index) => ({
                ...item,
                index,
                trigger: (item.trigger || "").trim(),
                body: (item.body || "").trim(),
            }))
            .filter((item) => item.trigger && item.body);
    }, [topic.learn_more_items]);

    const toggleLearnMore = (itemIndex) => {
        setExpandedItems((current) =>
            current.includes(itemIndex)
                ? current.filter((index) => index !== itemIndex)
                : [...current, itemIndex]
        );
    };

    const renderDescription = () => {
        const description = topic.description || "";

        if (learnMoreItems.length === 0) {
            return description;
        }

        const triggers = learnMoreItems
            .map((item) => item.trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .sort((a, b) => b.length - a.length);
        const pattern = new RegExp(`(${triggers.join("|")})`, "g");

        return description.split(pattern).map((part, index) => {
            const item = learnMoreItems.find((learnMoreItem) => learnMoreItem.trigger === part);

            if (!item) {
                return part;
            }

            const isExpanded = expandedItems.includes(item.index);

            return (
                <button
                    key={`${part}-${index}`}
                    type="button"
                    onClick={() => toggleLearnMore(item.index)}
                    className={learnMoreTriggerClass}
                    aria-expanded={isExpanded}
                >
                  <span>{part}</span>
                    <span
                        aria-hidden="true"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#F6940D] text-[10px] leading-none text-white"
                    >
                        ?
                    </span>
                </button>
            );
        });
    };

    const visibleLearnMoreItems = learnMoreItems.filter((item) => expandedItems.includes(item.index));

    return (
        <div
            className={`${topic.parent_id != null ? " pl-6 pt-1 pb-1 pr-1 -mx-3 " : " px-4 "} py-2 text-left bg-white rounded-2xl m-2`} style={{
                 backgroundColor:isSubtopic?topic.color:''
            }}
        >
            <div
                className={`${topic.parent_id != null ? "p-2" : ""} bg-white p-1 rounded-r-xl `}
            >
                <h3 className="font-[800] text-[#3A3A3A] mb-2 ">
                    {topic.title}
                </h3>
                <p className="whitespace-pre-line text-[#828282] font-[500] text-sm mb-4">
                    {renderDescription()}
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

                {visibleLearnMoreItems.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {visibleLearnMoreItems.map((item) => (
                            <div
                                key={item.index}
                                className="rounded-lg border-l-4 border-[#F6940D] bg-orange-50 p-4 text-sm text-gray-700"
                            >
                                {item.title && (
                                    <h4 className="mb-2 font-bold text-[#3A3A3A]">
                                        {item.title}
                                    </h4>
                                )}
                                <p className="whitespace-pre-line">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {Array.isArray(topic.topics) && topic.topics.map((sub,index) =>
                    <ShowTopics topic={sub} key={index} isSubtopic></ShowTopics>
                )}
            </div>
        </div>
    )
}
