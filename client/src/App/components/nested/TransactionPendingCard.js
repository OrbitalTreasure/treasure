const TransactionPendingCard = (props) => {
  const header = props.header || "Your transaction is currently pending";
  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <h2>{header}</h2>
      {props.steps.map((e, index) => {
        return (
          <div key={index}>
            <h3
              className={
                props.transactionPending == index + 1
                  ? "loadingStepsActive"
                  : "loadingStepsInactive"
              }
            >
              Step {index + 1}: {e.step}
            </h3>
            {props.transactionPending == index + 1 && (
              <p className="info">{e.info}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TransactionPendingCard;
