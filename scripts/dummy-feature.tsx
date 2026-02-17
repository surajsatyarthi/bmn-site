
// This is a dummy feature to test Ralph Protocol Security Scanner
// It contains a deliberate Dangerous HTML pattern (SEC-003)

export const DummyComponent = () => {
  return <div dangerouslySetInnerHTML={{ __html: '<script>alert("xss")</script>' }} />;
};
