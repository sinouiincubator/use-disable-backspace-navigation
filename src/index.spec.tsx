import React from 'react';
import {
  render,
  act,
  fireEvent,
  createEvent,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import useDisableBackspaceNavigation from './index';

afterEach(cleanup);

/**
 * 模拟 keydown 事件
 *
 * @param target keydown 事件目标元素
 */
function mockKeydownEvent(target: HTMLElement) {
  const mockPreventDefault = jest.fn();
  const keydownEvent = createEvent.keyDown(target, {
    key: 'Backspace',
    keyCode: 8,
  });
  keydownEvent.preventDefault = mockPreventDefault;

  return {
    mockPreventDefault,
    keydownEvent,
  };
}

it('阻止回退键页面回退', () => {
  const Demo = () => {
    useDisableBackspaceNavigation();

    return <div data-testid="content" />;
  };

  const { getByTestId } = render(<Demo />);

  const element = getByTestId('content');
  const { mockPreventDefault, keydownEvent } = mockKeydownEvent(element);

  act(() => {
    fireEvent(element, keydownEvent);
  });

  expect(mockPreventDefault).toBeCalled();
});

it('不影响在输入框中删除文本', () => {
  const Demo = () => {
    useDisableBackspaceNavigation();

    return <input data-testid="input" />;
  };

  const { getByTestId } = render(<Demo />);

  const element = getByTestId('input');
  const { mockPreventDefault, keydownEvent } = mockKeydownEvent(element);

  act(() => {
    fireEvent(element, keydownEvent);
  });

  expect(mockPreventDefault).not.toBeCalled();
});

it('不影响在多行文本框中删除文本', () => {
  const Demo = () => {
    useDisableBackspaceNavigation();

    return <textarea data-testid="textarea" />;
  };

  const { getByTestId } = render(<Demo />);

  const element = getByTestId('textarea');
  const { mockPreventDefault, keydownEvent } = mockKeydownEvent(element);

  act(() => {
    fireEvent(element, keydownEvent);
  });

  expect(mockPreventDefault).not.toBeCalled();
});

it('不影响可编辑元素删除文本', () => {
  const Demo = () => {
    useDisableBackspaceNavigation();

    return <div data-testid="contenteditable" contentEditable />;
  };

  const { getByTestId } = render(<Demo />);

  const element = getByTestId('contenteditable');
  const { mockPreventDefault, keydownEvent } = mockKeydownEvent(element);

  act(() => {
    fireEvent(element, keydownEvent);
  });

  expect(mockPreventDefault).not.toBeCalled();
});

it('如果输入框只读，阻止回退事件', () => {
  const Demo = () => {
    useDisableBackspaceNavigation();

    return <textarea data-testid="textarea" readOnly />;
  };

  const { getByTestId } = render(<Demo />);

  const element = getByTestId('textarea');
  const { mockPreventDefault, keydownEvent } = mockKeydownEvent(element);

  act(() => {
    fireEvent(element, keydownEvent);
  });

  expect(mockPreventDefault).toBeCalled();
});

it('如果输入框不可用，阻止回退事件', () => {
  const Demo = () => {
    useDisableBackspaceNavigation();

    return <textarea data-testid="textarea" disabled />;
  };

  const { getByTestId } = render(<Demo />);

  const element = getByTestId('textarea');
  const { mockPreventDefault, keydownEvent } = mockKeydownEvent(element);

  act(() => {
    fireEvent(element, keydownEvent);
  });

  expect(mockPreventDefault).toBeCalled();
});

it('hook 销毁后，取消事件监听', () => {
  const Child = () => {
    useDisableBackspaceNavigation();
    return null;
  };

  const Parent = ({ showChild }: { showChild: boolean }) => {
    return (
      <div>
        {showChild && <Child />}
        <input data-testid="input" readOnly />
      </div>
    );
  };

  const { getByTestId, rerender } = render(<Parent showChild />);

  const element = getByTestId('input');
  const { mockPreventDefault, keydownEvent } = mockKeydownEvent(element);

  // 应用了 useDisableBackspaceNavigation 情况下，阻止事件
  act(() => {
    fireEvent(element, keydownEvent);
  });
  expect(mockPreventDefault).toBeCalled();

  // 销毁 useDisableBackspaceNavigation 时， 不阻止事件
  mockPreventDefault.mockReset();
  act(() => {
    rerender(<Parent showChild={false} />);
  });
  act(() => {
    fireEvent(element, keydownEvent);
  });
  expect(mockPreventDefault).not.toBeCalled();
});
