import { useState,useCallback, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import { Typography, Box, Button,CircularProgress  } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const carouselItem = [
  {
    image: "https://cdn.pixabay.com/photo/2020/12/10/20/40/color-5821297_1280.jpg",
    title: "Explore our Classromms",
    description: "Engaging and Inspiring environments for every Studets",
  },
  {
    image: "https://cdn.pixabay.com/photo/2017/10/10/00/03/child-2835430_1280.jpg",
    title: "Explore our Students",
    description: "Provding the right tools for effective learnings",
  },
];
export default function Carousel() {
   const totalSlides = carouselItem.length;
  const [activeIndex, setActiveIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const handleNext =useCallback(()=>{
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  },[totalSlides])
    

  const handleBack = useCallback(()=>{
   setActiveIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  }, [totalSlides]) 

  const onChangeIndex = useCallback((index) => {
  setActiveIndex(index);
}, []);

//Autoplay

useEffect(()=>{
  const timer=setInterval(()=>{
    handleNext()
  },4000)
  return ()=>clearInterval(timer)
},[handleNext])

 // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handleBack();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handleBack]);

  return (
   <Box sx={{ position: "relative", width: "100%" }}>
      <SwipeableViews index={activeIndex} onChangeIndex={onChangeIndex}>
        {carouselItem.map((item, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              textAlign: "center",
              color: "white",
              height: "70vh",
              minHeight: "400px",
            }}
          >
            {/* Loader while image loads */}
            {!loaded && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <Box
              component="img"
              src={item.image}
              alt={item.title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            />

            {/* Swipe Hint Animation */}
            {showSwipeHint && index === activeIndex && (
              <Box
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  animation: "swipeHint 1.5s infinite",
                  "@keyframes swipeHint": {
                    "0%": { transform: "translateX(0)" },
                    "50%": { transform: "translateX(-10px)" },
                    "100%": { transform: "translateX(0)" },
                  },
                }}
              >
                👉
              </Box>
            )}

            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0,0,0,0.6)",
                padding: "10px 20px",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5">{item.title}</Typography>
              <Typography variant="body1">{item.description}</Typography>
            </Box>
          </Box>
        ))}
      </SwipeableViews>

      {/* Navigation Arrows */}
      <Box sx={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}>
        <Button variant="contained" onClick={() => { setShowSwipeHint(false); handleBack(); }}>
          <ArrowBackIosIcon />
        </Button>
      </Box>

      <Box sx={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }}>
        <Button variant="contained" onClick={() => { setShowSwipeHint(false); handleNext(); }}>
          <ArrowForwardIosIcon />
        </Button>
      </Box>
    </Box>
  );
}
