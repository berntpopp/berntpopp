return {
  {
    Str = function (elem)
      if elem.text == "Popp, B." then
        return pandoc.Strong {pandoc.Str "Popp, B."}
      else
        return elem
      end
    end,
  }
}