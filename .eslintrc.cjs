const path = require("path");

module.exports ={
  "extends": [
    "eslint: recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
    "prettier",
    "plugin:storybook/recommended"
  ],
  "plugins": ["prettier"],
  "settings": {
    "react": {
      //Nói eslint-plugin-react tự động biết version của React
      "version": "detect"
    },
    //Nói Eslint cách xử lý các import
    "import/resolver": {
      "node": {
        "paths": [path.resolve(__dirname)],
        "extension": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  "rules": {
    //Tắt rule yêu cầu import React trong file jsx
    "react/react-in-jsx-scope": "off",
    //Cảnh báo khi thẻ <a target= '_blank'> mà không có rel="noreferrer"
    "react/jsx-no-target-blank": "warn",
    //Tăng cường một số thẻ rule prettier (copy từ file .prettierrc qua)
    "prettier/prettier": [
      "warn",
      {
        "arrowParens": "always",
        "semi": "false",
        "trailingComma": "none",
        "tabWidth": 4,
        "endOfLine": "auto",
        "useTabs": false,
        "singleQuote": true,
        "printWidth": 120,
        "jsxSingleQuote": true
      }
    ]
  }
}
