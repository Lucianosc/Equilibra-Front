"use client";
import React, { useState, useEffect, FormEvent } from "react";
import InputText from "@/components/Form/InputText";
import InputImage from "@/components/Form/InputImage";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { useContractWrite } from "wagmi";
import { ethers } from "ethers";
import { projectRegistry } from "@/constants/abis";

interface FormState {
  description: string;
  link: string;
  fileHash: string;
}

interface ErrorCause {
  metaMessages: string[];
}

export default function CreateProject() {
  const [beneficiary, setBeneficiary] = useState("");
  const [formState, setFormState] = useState<FormState>({
    description: "",
    link: "",
    fileHash: "",
  });

  const handleChange = (value: string | number, name: string) => {
    if (name == "beneficiary" && typeof value === "string") {
      setBeneficiary(value);
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ipfsUpload = ipfsJsonUpload();

    toast
      .promise(ipfsUpload, {
        pending: "Uploading to IPFS...",
        success: "Successfully uploaded!",
        error: "Ups, something went wrong with IPFS.",
      })
      .then((ipfsHash: string) => {
        const abiCoder = new ethers.utils.AbiCoder();
        const encodedData = abiCoder.encode(["string"], [ipfsHash]);

        console.log("ipfs json hash: " + ipfsHash);
        write({
          args: [debouncedBeneficiary, encodedData],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const debouncedBeneficiary = useDebounce(beneficiary);

  const { write, data, error, isError, isLoading, isSuccess } =
    useContractWrite({
      address: projectRegistry.address,
      abi: projectRegistry.abi,
      functionName: "registerProject",
    });

  const ipfsJsonUpload = async () => {
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(formState),
        headers: {
          "content-type": "application/json",
        },
      });
      const json = await response.json();
      if (json?.IpfsHash) {
        return Promise.resolve(json.IpfsHash);
      } else {
        return Promise.reject("No ipfshash returned");
      }
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully Created a Project!");
    } else if (isError && error) {
      toast.error((error.cause as ErrorCause).metaMessages[0]);
    }
  }, [isLoading, isSuccess, isError]);

  return (
    <>
      <form
        className="mx-auto w-full max-w-2xl p-6 rounded-lg bg-background2 shadow"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="space-y-12">
          <div className="border-b border-white_10 pb-12">
            <h2>Create a project</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <InputText
                  label="Beneficiary address"
                  name="beneficiary"
                  handleChange={handleChange}
                  value={beneficiary}
                  type="text"
                  placeholder="Eth address"
                  required
                />
              </div>
              <div className="sm:col-span-4">
                <InputText
                  label="Project link"
                  name="link"
                  handleChange={handleChange}
                  value={formState.link}
                  type="text"
                  placeholder="Project link"
                />
              </div>
              <div className="col-span-full">
                <InputText
                  label="Description"
                  name="description"
                  handleChange={handleChange}
                  value={formState.description}
                  type="textarea"
                  rows={3}
                  placeholder="Project description..."
                  required
                />
              </div>
              <div className="col-span-full">
                <InputImage
                  label="Cover photo"
                  name="fileHash"
                  handleChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-primary text-background px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}