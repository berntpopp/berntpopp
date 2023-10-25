-- Desc: Strong filter for Popp, B.
-- based on https://gist.github.com/tarleb/afee1b1d97e52aca888f410e77b3624a
local highlight_author_filter = {
    Para = function(el)
      if el.t == "Para" then
      for k,_ in ipairs(el.content) do
        if el.content[k].t == "Str" and el.content[k].text == "Popp,"
        and el.content[k+1].t == "Space"
        and el.content[k+2].t == "Str" and el.content[k+2].text:find("^B.") then
            local _,e = el.content[k+2].text:find("^B.")
            local rest = el.content[k+2].text:sub(e+1) 
            el.content[k] = pandoc.Strong { pandoc.Str("Popp, B.") }
            el.content[k+1] = pandoc.Str(rest)
            table.remove(el.content, k+2) 
        end
      end
    end
    return el
    end
  }
  
  function Div (div)
    if 'refs' == div.identifier then
      return pandoc.walk_block(div, highlight_author_filter)
    end
    return nil
  end