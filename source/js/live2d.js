addEventListener("DOMContentLoaded", function () {
    let models = [
      {
        width: 160,
        height: 400,
        scale: 0.05,
        left: "0px",
        bottom: "0px",
        role: "https://apache.002026.xyz/live2d_api/model/MO/MO.v1.3.3/MO.model3.json",
        background: "",
        opacity: 1,
        mobile: false,
        draggable: false,
      }
    ];
    new Live2dLoader(models);
  });