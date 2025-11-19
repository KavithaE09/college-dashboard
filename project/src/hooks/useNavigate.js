export const useNavigate = () => {
  const navigate = (path) => {
    const appState = { currentPage: path };
    window.history.pushState(appState, '', `/${path}`);
    window.dispatchEvent(new Event('popstate'));
  };

  return navigate;
};
