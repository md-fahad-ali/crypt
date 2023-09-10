import axios from "axios";
import NextImage from "next/image";
import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
const slugify = require("slugify");
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import { getCookie, setCookie } from "cookies-next";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";

function CreateCommunity(props) {
  const [file, setFile] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [up, setUp] = useState(true);
  const [ufile, setUFile] = useState();
  const router = useRouter();

  //stepper configuration
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  console.log(props);
  // Form Element
  const [img, setImage] = useState("");
  const [coName, setCoName] = useState("");
  const [description, setDescription] = useState("");
  const [option, setOption] = useState("");
  const [errorName, setErrorName] = useState("");

  function handleChange(e) {
    setIsOpen(true);
    // console.log(e.target.files);
    setFile(URL?.createObjectURL(e.target.files[0]));
    setUFile(e?.target?.files[0]);
    const image = new Image();
    image.src = URL.createObjectURL(e.target.files[0]);
    image.onload = () => {
      if (image.width != image.height) {
        setError("Image width and height must be the same");
        setUp(false);
      } else {
        setError("");
        if (e.target.files[0].size > 2 * 1024 * 1024) {
          setError("File size exceeds 2MB");
          setIsOpen(false);
          console.log("size exceeds");
        } else {
          setUp(true);
          setImage(e.target.files[0].name);
          console.log("ok to upload");
        }
      }
    };
  }

  async function submitForm(e) {
    e.preventDefault();

    console.log(coName, ufile, description, option);
    // try {
    //   console.log(props?.props?.api_url);
    //   const res = await axios.get(
    //     `${props?.props?.api_url}/c/${router.query?.co_name}`,
    //     {
    //       withCredentials: true,
    //     }
    //   );

    //   console.log(res.data?.csrfToken);

    //   if (up) {
    //     const company_slug = slugify(e.target.name.value.toLowerCase());
    //     console.log(company_slug);
    //     const result = await axios.post(
    //       `${props?.props?.api_url}/c/create`,
    //       {
    //         company_name: e.target.name.value,
    //         company_slug: slugify(e.target.name.value.toLowerCase()),
    //         description: e.target.description.value,
    //         ufile: ufile,
    //         option: e.target.option.value,
    //         created_by:
    //           props?.props?.data?.session?.passport?.user?.username || null,
    //         csrfToken: res.data?.csrfToken,
    //       },
    //       {
    //         withCredentials: true,
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //           "x-csrf-token": props?.props?.csrfForHeader,
    //         },
    //       }
    //     );
    //     if (result.data && result.status == 200) {
    //       console.log(result);

    //       toast.success("Community was created successfully!", {
    //         position: "top-right",
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "dark",
    //       });
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setError(error?.response?.data?.error);
    //   setErrorName(error?.response?.data?.errorName);
    // }
  }

  const Catagories = [
    "game",
    "tech",
    "art",
    "education",
    "medical",
    "entertainmaint",
  ];

  function makeFirstCp(value) {
    let result = value
      .split("")
      .map((char, index) => (index === 0 ? char.toUpperCase() : char))
      .join("");
    return result;
  }

  return (
    <div className="h-screen bg-zinc-800 sm:flex">
      <div className="md:h-screen p-5 space-y-6 sm:w-1/2 flex items-center justify-center bg-zinc-800">
        <div>
          <div className="py-4 pr-4">
            <Stepper
              activeStep={activeStep}
              isLastStep={(value) => setIsLastStep(value)}
              isFirstStep={(value) => setIsFirstStep(value)}
              lineClassName=""
              activeLineClassName=""
            >
              <Step
                activeClassName="ring-0 !bg-transparent text-white"
                completedClassName="!bg-black text-white"
                className="px-4 py-2 text-zinc-400"
              >
                1
                <div className="absolute -bottom-[1.3rem] mb:-bottom-[2.3rem] w-max -left-3 text-center">
                  <Typography variant="p" color="inherit">
                    Basic Info
                  </Typography>
                </div>
              </Step>
              <Step
                activeClassName="ring-0 !bg-zinc-600 text-white"
                completedClassName="!bg-black text-white"
                className="px-4 py-2 text-zinc-400"
              >
                2
                <div className="absolute -bottom-[1.3rem] mb:-bottom-[2.3rem] w-max -left-5 text-center">
                  <Typography variant="h6" color="inherit">
                    Link Account
                  </Typography>
                </div>
              </Step>
              <Step
                activeClassName="ring-0 !bg-black text-white"
                completedClassName="!bg-black text-white"
                className="px-4 py-2 text-zinc-400"
              >
                3
                <div className="absolute -bottom-[1.3rem] mb:-bottom-[2.3rem] w-max -left-3 text-center">
                  <Typography variant="h6" color="inherit">
                    Catagories
                  </Typography>
                </div>
              </Step>
            </Stepper>
          </div>
          <br />
          <br />

          <h1 className="text-white text-3xl font-extrabold">
            Let's create the Community.
          </h1>
          <p className="text-white">
            Please fill up the data so that users can understand
          </p>
          <br />
          <form
            onSubmit={(e) => {
              submitForm(e);
            }}
            // encType="multipart/form-data"
          >
            {activeStep == 0 && (
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Image
                  </label>
                  <label for="dropzone-file" className="">
                    {isOpen ? (
                      <div>
                        <NextImage
                          src={file}
                          width={100}
                          height={100}
                          alt="Upload"
                        />
                      </div>
                    ) : (
                      <div className=" h-20 bg-slate-600 w-20 flex justify-center items-center">
                        <AiOutlineCloudUpload className="text-2xl text-white" />
                      </div>
                    )}
                    <input
                      id="dropzone-file"
                      type="file"
                      name="file"
                      onChange={handleChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  <p className="text-sm text-red-600 dark:text-red-600">
                    {error}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Name
                    </label>
                    <p className="text-red-700 text-center">{errorName}</p>
                  </div>

                  <input
                    type="name"
                    id="name"
                    name="name"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setCoName(e.target.value);
                    }}
                    className="bg-transparent text-white border border-gray-400 text-sm rounded-lg block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400"
                    placeholder="Name of you community here "
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Description
                  </label>
                  <textarea
                    type="description"
                    id="description"
                    name="description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    placeholder="Write here community description"
                    className="bg-transparent text-white border h-[83px] focus:border-gray-400 focus:ring-gray-400 border-gray-400 text-sm rounded-lg block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400"
                    cols={5}
                    rows={10}
                    required
                  />
                </div>

                <div className="mb-6 w-full">
                  <select
                    name="option"
                    onChange={(e) => {
                      setOption(e.target.value);
                    }}
                    
                    defaultValue={"polygon"}
                    className="block w-full focus:border-gray-400 focus:ring-gray-400 border-gray-400 mb-2 text-sm bg-transparent font-medium text-white"
                  >
                    <option value="polygon" selected>Polygon Mainnet</option>
                    <option value="ethereum">Ethereum Mainnet</option>
                  </select>
                </div>
              </div>
            )}
            {activeStep == 1 && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Discord Account
                    </label>
                    <p className="text-red-700 text-center">{errorName}</p>
                  </div>

                  <input
                    type="discord_acc"
                    id="discord_acc"
                    name="discrod_acc"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setCoName(e.target.value);
                    }}
                    className="bg-transparent text-white border border-gray-400 text-sm rounded-lg block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400"
                    placeholder="Name of you community here "
                    required
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Twitter Account
                    </label>
                    <p className="text-red-700 text-center">{errorName}</p>
                  </div>

                  <input
                    type="twitter_acc"
                    id="twitter_acc"
                    name="twitter_acc"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setCoName(e.target.value);
                    }}
                    className="bg-transparent text-white border border-gray-400 text-sm rounded-lg block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400"
                    placeholder="Name of you community here "
                    required
                  />
                </div>
              </div>
            )}
            {activeStep == 2 && (
              // <div>
              //   <ul class="flex flex-wrap gap-4 max-w-md md:w-1/2 mx-auto">

              //     {Catagories.map((e, i) => (
              //       <li class="relative flex  md:w-full">
              //         <input
              //           class="sr-only peer"
              //           type="radio"
              //           value={`${e}`}
              //           name="answer"
              //           id={`${e}`}
              //         />
              //         <label
              //           class="flex p-1 sm:p-3 text-lg sm:text-sm text-white bg-zinc-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-zinc-700 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent"
              //           for={`${e}`}
              //         >
              //           {makeFirstCp(e)}
              //         </label>
              //       </li>
              //     ))}

              //   </ul>
              // </div>

              <div class="space-x-2">
                {Catagories.map((e, i) => (
                  <label key={`${i}`} class="inline-flex mb-3 items-center">
                    <input
                      type="radio"
                      class="sr-only peer"
                      name="tag"
                      id={`${e}`}
                      value={`${e}`}
                    />
                    <span class="bg-zinc-600 text-white rounded-full px-2 py-1 text-md focus:outline-none  peer-checked:ring-blue-500 peer-checked:ring-2 peer-checked:border-transparent cursor-pointer">
                      {e}
                    </span>
                  </label>
                ))}
              </div>
            )}
            <br />
            {activeStep == 2 && (
              <div className="flex flex-row-reverse gap-3">
                <button
                  type="submit"
                  className="text-white w-2/3 bg-zinc-900 hover:bg-zinc-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
                <Button
                  onClick={handlePrev}
                  className="bg-zinc-900 w-1/3"
                  disabled={isFirstStep}
                >
                  Prev
                </Button>
              </div>
            )}
            <br />

            {activeStep < 2 && (
              <div className="flex justify-between">
                <Button
                  onClick={handlePrev}
                  className="bg-zinc-900"
                  disabled={isFirstStep}
                >
                  Prev
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-zinc-900"
                  disabled={isLastStep}
                >
                  Next
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="hidden sm:flex p-6 space-y-6 w-1/2 md:flex bg-zinc-600"></div>
    </div>
  );
}

export default CreateCommunity;

export async function getServerSideProps(context) {
  const { req, res } = context;
  const t = getCookie("uniqueId", { req, res });
  const ck = t?.length || 0;
  if (ck == 0) {
    setCookie("uniqueId", uuid(), {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 1000,
      sameSite: "lax",
      path: "/",
    });
    console.log("cookie set");
  }

  try {
    const test = await axios.get(
      `${process.env.WEB_URL}/c/${context?.query?.co_name}`,
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie,
          origin: "http://localhost:3000",
        },
      }
    );

    console.log("test data ", test.data);

    return {
      props: {
        data: test.data,
        api_url: process.env.WEB_URL,
        csrfForHeader: getCookie("uniqueId", { req, res }),
      },
    };
  } catch (error) {
    return {
      props: {
        data: {},
        api_url: process.env.WEB_URL,
      },
    };
  }
  // console.log(process.env.WEB_URL);
}
