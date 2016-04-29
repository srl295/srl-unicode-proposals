PROJS=unicode-image-hash
COMMON=uproposal

PDFS=$(PROJS:%=%.pdf)
HOOKTYPE=commit checkout merge
HOOKS=$(HOOKTYPE:%=.git/hooks/post-%)
HOOKURL=https://raw.githubusercontent.com/Hightor/gitinfo2/CTAN/post-xxx-sample.txt
FETCH=curl  $(HOOKURL)

all:	$(HOOKS) $(PDFS)
	echo all done

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


