import axios from "axios";
import NextImage from "next/image";
import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
const slugify = require("slugify");
import { setup } from "../../lib/csrf";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

function CreateCommunity(props) {
  const [file, setFile] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [up, setUp] = useState(true);
  const [ufile, setUFile] = useState();
  const router = useRouter();

  // console.log(props?.props);
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

    // const formData = {
    //   name: coName,
    //   description: description,
    //   image: ufile,
    //   company_slug: company_slug,
    //   option: option,
    // };
    // const formData = new FormData();
    // formData.append("name", coName);
    // formData.append("description", description);
    // formData.append("image", ufile);
    // formData.append("company_slug", company_slug);
    // formData.append("option", option);

    // console.log(
    //   "formdata",
    //   coName,
    //   description,
    //   ufile,
    //   company_slug,
    //   option,
    //   formData
    // );
    // formData.append("_csrf",  props?.props?.data,);

    try {
      console.log(props?.props?.api_url);
      const res = await axios.get(
        `${props?.props?.api_url}/c/${router.query?.co_name}`,
        {
          withCredentials: true,
        }
      );

      console.log(res.data?.csrfToken);

      if (up) {
        const company_slug = slugify(e.target.name.value.toLowerCase());
        console.log(company_slug);
        const result = await axios.post(
          `${props?.props?.api_url}/c/create`,
          {
            company_name: e.target.name.value,
            company_slug: slugify(e.target.name.value.toLowerCase()),
            description: e.target.description.value,
            ufile: ufile,
            option: e.target.option.value,
            created_by:
              props?.props?.data?.session?.passport?.user?.username || null,
            csrfToken: res.data?.csrfToken,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              "x-csrf-token": props?.props?.csrfForHeader,
            },
          }
        );
        if (result.data && result.status == 200) {
          console.log(result);

          toast.success("Community was created successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.error);
      setErrorName(error?.response?.data?.errorName);
    }
  }

  return (
    <div className="w-full flex">
      {/* <!-- Main modal --> */}
      <div
        id="defaultModal"
        tabindex="-1"
        aria-hidden="true"
        className="top-0 flex items-center justify-center fixed left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-0rem)] max-h-full`"
      >
        <div className="relative w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-zinc-800">
            {/* <!-- Modal header --> */}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create Community
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal"
                onClick={() => {
                  props.setModal(false);
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-6 space-y-6">
              <form
                onSubmit={(e) => {
                  submitForm(e);
                }}
                // encType="multipart/form-data"
              >
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                        <AiOutlineCloudUpload className="text-2xl text-slate-600 dark:text-white" />
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

                <div className="mb-6">
                  <div className="flex justify-between">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Name of you community here "
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    className="bg-gray-50 border h-[83px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:border-white"
                    cols={5}
                    rows={10}
                    required
                  />
                </div>
                <div className="mb-6">
                  <select
                    name="option"
                    onChange={(e) => {
                      setOption(e.target.value);
                    }}
                    className="block mb-2 text-sm bg-transparent font-medium text-gray-900 dark:text-white"
                  >
                    <option value="polygon">Polygon Mainnet</option>
                    <option value="ethereum">Ethereum Mainnet</option>
                  </select>
                </div>
                <button
                  // onClick={(e) => {
                  //   submitForm(e);
                  // }}
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCommunity;
