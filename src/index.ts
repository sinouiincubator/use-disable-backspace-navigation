import { useEffect } from 'react';

const BACKSPACE_KEY_CODE = 8;
const INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

/**
 * 阻止浏览器中按回格键页面返回的默认行为
 */
function useDisableBackspaceNavigation() {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const { keyCode, target } = event;

      const isBackspace = keyCode === BACKSPACE_KEY_CODE;
      if (isBackspace) {
        const inputTarget = target as HTMLInputElement;
        const isInput =
          INPUT_TAGS.indexOf(inputTarget.tagName.toUpperCase()) !== -1;
        const isEnable = !(inputTarget.disabled || inputTarget.readOnly);
        const isContentEditable =
          inputTarget.getAttribute('contenteditable') === 'true' ||
          inputTarget.isContentEditable;

        if ((isInput && !isEnable) || (!isInput && !isContentEditable)) {
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown, false);

    return () => {
      document.removeEventListener('keydown', handleKeydown, false);
    };
  });
}

export default useDisableBackspaceNavigation;
