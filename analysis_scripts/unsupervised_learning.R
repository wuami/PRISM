library(RColorBrewer)

data = read.table('~/Documents/stanford/courses/spring\ 2015/bmi212/data/alldata_150527.txt')
features = read.table('~/Documents/stanford/courses/spring\ 2015/bmi212/data/features.txt', header=T)
result = read.table('~/Documents/stanford/courses/spring\ 2015/bmi212/data/response.txt')

colnames(data) = c(colnames(features), 'user')
data$user = factor(data$user)
levels(data$user) = 1:nlevels(data$user)
data$user = as.numeric(data$user)
subset = apply(data, 2, var, na.rm=TRUE) != 0 & !apply(is.na(data), 2, any)

scale = colorRampPalette(c('white', 'purple'))(n=10)

pdf('~/Documents/stanford/courses/spring\ 2015/bmi212/results/heatmap.pdf', width=6, height=7)
heatmap(scale(data[,subset]), RowSideColors=rainbow(max(data$user))[data$user], labRow=NA)#, col=colorRampPalette(c('white', 'purple'))(n=100))
heatmap(scale(data[,subset]), RowSideColors=scale[unlist(result[1,])], labRow=NA)#, col=colorRampPalette(c('white', 'purple'))(n=100))
heatmap(scale(data[,subset]), RowSideColors=scale[unlist(result[2,])], labRow=NA)#, col=colorRampPalette(c('white', 'purple'))(n=100))
heatmap(scale(data[,subset]), RowSideColors=scale[unlist(result[3,])], labRow=NA)#, col=colorRampPalette(c('white', 'purple'))(n=100))
dev.off()

# PCA
pc = prcomp(data[,subset])
pc_data = data.frame(pc$x, happiness=t(result[1,]), energy=t(result[2,]), relax=t(result[3,]), user=data$user)
ggplot(data.frame(pc_data)) + geom_point(aes(PC1,PC2,color=factor(user)), size=3)
