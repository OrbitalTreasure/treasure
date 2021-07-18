// import the stylesheet
import "react-step-progress/dist/index.css";
import styles from "../../assets/styles/ProgressSteps.module.scss";

const TransactionPendingCard = (props) => {
  const header = props.header || "Your transaction is currently pending";
  const data = props.steps.map((e, index) => {
    return {
      label: e.step,
      name: e.step + "name",
      content: e.info,
      index: index,
    };
  });
  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <h2 style={{ marginBottom: "50px" }}>{header}</h2>
      <ul className={`${styles["step-progress-bar"]}`}>
        {data.map((step, i) => {
          return (
            <li
              key={i}
              className={`${styles["progress-step"]}${
                step.index < props.transactionPending - 1
                  ? ` ${styles.completed}`
                  : ""
              }${
                step.index === props.transactionPending - 1
                  ? ` ${styles.current}`
                  : ""
              }`}
            >
              {step.index < props.transactionPending - 1 && (
                <span className={styles["step-icon"]}>
                  <svg
                    width="1.5rem"
                    viewBox="0 0 13 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 3.5L4.5 7.5L12 1"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              )}
              {step.index >= props.transactionPending - 1 && (
                <span className={styles["step-index"]}>{i + 1}</span>
              )}
              <div className={`${styles["step-label"]}`}>
                {step.label}
                {step.subtitle && (
                  <div className={`${styles["step-label-subtitle"]}`}>
                    {step.subtitle}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className={`${styles["step-content"]}`}>
        {data[props.transactionPending - 1].content}
      </div>
    </div>
  );
};

export default TransactionPendingCard;
