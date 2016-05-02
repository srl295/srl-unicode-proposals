PROJS=unicode-image-hash
COMMON=uproposal

PDFS=$(PROJS:%=%.pdf)
HOOKTYPE=commit checkout merge
HOOKS=$(HOOKTYPE:%=.git/hooks/post-%)
HOOKURL=https://raw.githubusercontent.com/Hightor/gitinfo2/CTAN/post-xxx-sample.txt
FETCH=curl  $(HOOKURL)
SAMPLE=chai.json chai-encode.txt chai-decode.txt

all:	$(HOOKS) $(PDFS)
	echo all done


samples: $(SAMPLE)

chai-encode.txt chai.json chai.txt: chai-encode.js chai.png
	node chai-encode.js | tee chai-encode.txt

chai-decode.txt: chai-decode.js chai.json chai.txt
	node chai-decode.js | tee chai-decode.txt

COMMON_FILES=$(COMMON).sty $(COMMON).bib

$(HOOKS):
	@for h in $@; do \
		echo Updating  $$h from $(HOOKURL) ; \
		$(FETCH) > $$h ; \
		chmod a+x $$h ; \
	done


%.pdf: %.tex $(COMMON_FILES)
	xelatex $* && bibtex $* && xelatex $* && xelatex $*


clean:
	-echo "Note: .git/hooks/ won't be cleaned out."
	-git clean -f -X
	-rm -rf $(PDFS)

.PHONY: clean all


