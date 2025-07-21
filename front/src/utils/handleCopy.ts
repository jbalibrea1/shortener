interface handleCopyProps {
  url: string;
  desc?: string;
  title?: string;
  toast: (
    msg: string,
    opts?: { type?: "success" | "error"; desc?: string },
  ) => void;
}

const handleCopy = ({ url, desc, title, toast }: handleCopyProps) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      toast(title ?? "Link copied", {
        type: "success",
        desc: desc ?? "Link successfully copied to clipboard 🎉",
      });
    })
    .catch((error) => {
      console.error(error);
      toast("Error copying link", {
        type: "error",
        desc: "Please try again.",
      });
    });
};

export default handleCopy;
