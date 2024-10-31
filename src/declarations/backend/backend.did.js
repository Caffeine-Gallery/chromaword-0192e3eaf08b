export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'checkGuess' : IDL.Func(
        [IDL.Text],
        [IDL.Record({ 'correct' : IDL.Bool, 'feedback' : IDL.Text })],
        ['query'],
      ),
    'getCurrentWord' : IDL.Func([], [IDL.Text], ['query']),
    'startGame' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
