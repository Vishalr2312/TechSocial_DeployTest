import HomeLeft from "@/components/TechSocial/home/menu/HomeLeft";
import PostInputs from "./PostInputs/PostInputs";
import HomeRight from "./menu/HomeRight";
import Ts_PostFeeds from "./PostFeeds/Ts_PostFeeds";


const HomeComp = () => {
  return (
    <>
      <main className="main-content">
        <div className="container sidebar-toggler">
          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-6 cus-z2">
              {/* Home Left */}
              <HomeLeft clss="d-lg-none" />
            </div>
            <div className="col-xxl-6 col-xl-5 col-lg-8 mt-0 mt-lg-10 mt-xl-0 d-flex flex-column gap-7 cus-z">
              {/* Story Slider */}
              {/* <StorySlider /> */}

              {/* Make Post */}
              <PostInputs />

              {/* Feeds */}
              <Ts_PostFeeds clss="p-3 p-sm-5" />
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-6 mt-5 mt-xl-0">
              {/* Home Right */}
              <HomeRight />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomeComp;
